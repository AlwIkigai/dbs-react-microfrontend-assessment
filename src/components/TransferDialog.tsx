// import { useEffect, useRef } from 'react' // Synchronise the native dialog with React.
import { useEffect, useRef, useState } from 'react'
// import { useQuery } from '@tanstack/react-query' // Manage saved-payee data and request state.
// import { apiFetch } from '../api/client' // Reuse the supplied request helper.
// import type { PayeesResponse } from '../api/types' // Describe the payees response.
// import type { Account, PayeesResponse } from '../api/types' // Describe the payees response.
import { formatMoney } from '../lib/format' // Format the daily allowance.
// import { useForm } from 'react-hook-form' // Manage form inputs and errors.
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' // Connect Zod to the form.
import { createAmountSchema } from '../lib/transfer-schema'
import type { AmountFormValues } from '../lib/transfer-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, apiFetch } from '../api/client' // Access structured API errors.
import { newRecipientSchema } from '../lib/transfer-schema'
import type { NewRecipientFormValues } from '../lib/transfer-schema'
import type {
    Account,
    PayeesResponse,
    CreateTransferRequest,
    TransferResponse,
} from '../api/types'
// Step 1: Describe what the parent must provide.
// Step: Describe the data and action supplied by App.
interface TransferDialogProps {
    onClose: () => void // Close the dialog.
    accounts: Account[] // Supply eligible sender accounts.
    remainingLimit: number // Supply today's remaining allowance.
}

// Step 2: Define the transfer dialog shell.
export default function TransferDialog({
    onClose,
    accounts,
    remainingLimit,
}: TransferDialogProps) {
    // use state declaration
    // Step 1: Track recipient search and selection.
    // Step: Choose between a saved payee and a new recipient.
    const [recipientMode, setRecipientMode] = useState<'saved' | 'new'>('saved')
    const [payeeSearch, setPayeeSearch] = useState('') // Store the search text.
    const [selectedPayeeId, setSelectedPayeeId] = useState('') // Store the selected recipient's ID.
    // Step: Track the current transfer screen.
    const [step, setStep] = useState<'recipient' | 'amount' | 'review'>('recipient')
    const stepHeadingRef = useRef<HTMLHeadingElement>(null)
    // Step: Connect amount inputs to our central validation rules.
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        formState: { errors },
    } = useForm<AmountFormValues>({
        resolver: zodResolver(createAmountSchema(accounts, remainingLimit)),
        mode: 'onBlur', // Validate when leaving an input.
        reValidateMode: 'onBlur', // Recheck errors when leaving the input again.
        shouldFocusError: true, // Focus the first invalid field on submit.
        defaultValues: {
            fromAccountId: accounts[0]?.id ?? '', // Start with the first deposit account.
            amount: '', // Let the user enter an amount.
            note: '', // Optional note starts empty.
        },
    })
    // Step: Manage and validate new-recipient details.
    const {
        register: registerRecipient,
        handleSubmit: submitRecipient,
        control: recipientControl, // Added to the existing form.
        setError: setRecipientError, // Attach server errors to the new-recipient form.
        formState: { errors: recipientErrors },
    } = useForm<NewRecipientFormValues>({
        resolver: zodResolver(newRecipientSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        shouldFocusError: true,
        defaultValues: {
            name: '',
            accountNumber: '',
            bank: '',
        },
    })

    // Step: Read the new-recipient details for Review.
    const newRecipient = useWatch({
        control: recipientControl,
    })


    // Step: Read current values for balance display and the note counter.
    const selectedAccountId = useWatch({ control, name: 'fromAccountId' }) // Get the selected account ID from the form.
    const selectedAccount = accounts.find(
        (account) => account.id === selectedAccountId,
    ) // Derive the selected account from API data.
    const note = useWatch({ control, name: 'note' }) // Get the current note text for the character counter.
    // Step: Derive the details displayed on Review.
    const amountText = useWatch({
        control,
        name: 'amount',
    }) // Read the entered amount.


    const dialogRef = useRef<HTMLDialogElement>(null) // Reference the real HTML dialog.
    // Step: Fetch saved recipients when the dialog mounts.
    const payees = useQuery({
        queryKey: ['payees'], // Identify saved recipients in the cache.
        queryFn: () => apiFetch<PayeesResponse>('/api/payees'), // Request the saved-payee list.
        retry: false, // Let the user explicitly retry a failed request.
    })
    const selectedPayee = payees.data?.payees.find(
        (payee) => payee.id === selectedPayeeId,
    ) // Find recipient details using the selected ID.
    // Step 2: Derive the matching list while safely handling unloaded data.
    // Step: Display details from the chosen recipient mode.
    const recipientName = recipientMode === 'new'
        ? newRecipient.name
        : selectedPayee?.name

    const recipientBank = recipientMode === 'new'
        ? newRecipient.bank
        : selectedPayee?.bank

    const recipientMaskedNumber = recipientMode === 'new'
        ? `•••• ${(newRecipient.accountNumber ?? '').slice(-4)}`
        : selectedPayee?.accountNumberMasked
    const matchingPayees = (payees.data?.payees ?? []).filter(
        (payee) =>
            payee.name.toLowerCase().includes(payeeSearch.trim().toLowerCase()), // Match names regardless of case.
    )
    // Step: Access the shared cache and prevent duplicate submissions.
    const queryClient = useQueryClient()
    const sendLock = useRef(false) // Block a second click immediately.

    // Step: Manage the transfer request and its outcome.
    const transfer = useMutation({
        mutationFn: (request: CreateTransferRequest) =>
            apiFetch<TransferResponse>('/api/transfers', {
                method: 'POST', // Create a transfer.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request), // Send JSON matching the API contract.
            }),
        retry: false, // Never automatically repeat a money-moving request.
        onSuccess: () => {
            // Refresh all three dashboard data sources after success.
            void queryClient.invalidateQueries({ queryKey: ['customer'] })
            void queryClient.invalidateQueries({ queryKey: ['accounts'] })
            void queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onSettled: () => {
            sendLock.current = false // Release the immediate lock when the request finishes.
        },
        // Step: Copy server field errors into the existing form error system.
        onError: (error) => {
            if (!(error instanceof ApiError) || !error.fields) return

            const fieldNames = ['fromAccountId', 'amount', 'note'] as const

            for (const field of fieldNames) {
                const message = error.fields[field] // Read the API's message for this field.

                if (message) {
                    setError(field, {
                        type: 'server',
                        message,
                    })
                }
            }
            // Step: Map API recipient errors to the new-recipient form.
            const recipientFields = ['name', 'accountNumber', 'bank'] as const

            for (const field of recipientFields) {
                const message = error.fields[`recipient.${field}`] // Read the API's nested field key.

                if (message) {
                    setRecipientError(field, {
                        type: 'server',
                        message,
                    })
                }
            }
        },
    })

    // Step: Revalidate the form before constructing a saved-payee transfer.
    // Step: Run validation from the click handler, then send once.
    // Step: Validate and send exactly one recipient representation.
    const confirmTransfer = () => {
        if (sendLock.current || transfer.isPending || transfer.isSuccess) return

        void handleSubmit((values) => {
            const send = (
                recipientDetails: Pick<CreateTransferRequest, 'payeeId' | 'recipient'>,
            ) => {
                if (sendLock.current) return // Block duplicate submissions.
                sendLock.current = true

                transfer.mutate({
                    fromAccountId: values.fromAccountId,
                    amount: Number(values.amount),
                    note: values.note,
                    ...recipientDetails, // Include either payeeId OR recipient.
                })
            }

            if (recipientMode === 'saved') {
                if (!selectedPayee) {
                    setStep('recipient') // Recover if the saved recipient is unavailable.
                    return
                }

                send({ payeeId: selectedPayee.id })
            } else {
                void submitRecipient((recipient) => {
                    send({ recipient }) // Use validated, trimmed new-recipient values.
                }, () => {
                    setStep('recipient') // Return to recipient fields if invalid.
                })()
            }
        }, () => {
            setStep('amount') // Return to amount fields if invalid.
        })()
    }
    // Step: Focus the Amount heading after React renders it.
    // Step: Focus the active step heading after it renders.
    useEffect(() => {
        stepHeadingRef.current?.focus()
    }, [step, transfer.isSuccess])
    // Step: Open the dialog and restore keyboard focus when it closes.
    useEffect(() => {
        const dialog = dialogRef.current // Get the native dialog element.
        if (!dialog) return // Stop if it isn't mounted.

        const previousFocus = document.activeElement // Remember the focused element before opening.

        dialog.showModal() // Open the modal and move focus inside.

        return () => {
            dialog.close() // Close the native dialog during cleanup.

            if (previousFocus instanceof HTMLElement) {
                previousFocus.focus() // Return keyboard focus to the opening element.
            }
        }
    }, [])
    // Step: Read the saved-recipient error from the failed transfer response.
    const payeeError =
        recipientMode === 'saved' && transfer.error instanceof ApiError
            ? transfer.error.fields?.payeeId
            : undefined

    return (
        <dialog
            ref={dialogRef} // Connect the HTML element to our ref.
            className="transfer-dialog" // Apply desktop/mobile dialog styles.
            aria-labelledby="transfer-title" // Give the dialog an accessible name.
            onCancel={(event) => {
                event.preventDefault() // Let React control closing after Escape.
                onClose() // Tell App to remove the dialog.
            }}
        >
            <div className="transfer-heading">
                <h2 id="transfer-title">New transfer</h2>
                <button type="button" onClick={onClose} aria-label="Close transfer">
                    ✕
                </button>
            </div>

            <ol aria-label="Transfer steps">
                <li aria-current={step === 'recipient' ? 'step' : undefined}>Recipient</li>
                <li aria-current={step === 'amount' ? 'step' : undefined}>Amount</li>
                <li aria-current={step === 'review' ? 'step' : undefined}>Review</li>
            </ol>
            {/* Step: The heading, request states and payee list all stay inside this section. */}
            {/* Step: Switch recipient-entry modes without discarding form values. */}
            {step === 'recipient' && (
                <div>
                    <button
                        type="button"
                        aria-pressed={recipientMode === 'saved'}
                        onClick={() => setRecipientMode('saved')}
                    >
                        Saved recipients
                    </button>
                    <button
                        type="button"
                        aria-pressed={recipientMode === 'new'}
                        onClick={() => setRecipientMode('new')}
                    >
                        Send to someone new
                    </button>
                </div>
            )}

            {/* Step: Display and validate the new-recipient fields. */}
            {step === 'recipient' && recipientMode === 'new' && (
                <form
                    noValidate
                    onSubmit={submitRecipient(() => setStep('amount'))}
                >
                    <h3>Who are you sending to?</h3>

                    <label htmlFor="recipient-name">Recipient name</label>
                    <input
                        id="recipient-name"
                        {...registerRecipient('name')}
                        aria-invalid={Boolean(recipientErrors.name)}
                        aria-describedby={recipientErrors.name ? 'recipient-name-error' : undefined}
                    />
                    {recipientErrors.name && (
                        <p id="recipient-name-error" role="alert">
                            {recipientErrors.name.message}
                        </p>
                    )}

                    <label htmlFor="recipient-account">Account number</label>
                    <input
                        id="recipient-account"
                        type="text"
                        inputMode="numeric" // Request a numeric keyboard without losing leading zeros.
                        {...registerRecipient('accountNumber')}
                        aria-invalid={Boolean(recipientErrors.accountNumber)}
                        aria-describedby={recipientErrors.accountNumber ? 'recipient-account-error' : undefined}
                    />
                    {recipientErrors.accountNumber && (
                        <p id="recipient-account-error" role="alert">
                            {recipientErrors.accountNumber.message}
                        </p>
                    )}

                    <label htmlFor="recipient-bank">Bank</label>
                    <input
                        id="recipient-bank"
                        {...registerRecipient('bank')}
                        aria-invalid={Boolean(recipientErrors.bank)}
                        aria-describedby={recipientErrors.bank ? 'recipient-bank-error' : undefined}
                    />
                    {recipientErrors.bank && (
                        <p id="recipient-bank-error" role="alert">
                            {recipientErrors.bank.message}
                        </p>
                    )}

                    <button type="submit">Continue</button>
                </form>
            )}
            {step === 'recipient' && recipientMode === 'saved' && (
                <section>
                    <h3>Who are you sending to?</h3>
                    {/* Step: Display the payee request state. */}
                    {payees.isPending && (
                        <p role="status">Loading recipients…</p>
                    )}

                    {payees.isError && (
                        <div role="alert">
                            <p>We couldn't load your recipients.</p>
                            <button type="button" onClick={() => void payees.refetch()}>
                                Retry
                            </button>
                        </div>
                    )}
                    {payees.isSuccess && (
                        <div>
                            <label htmlFor="payee-search">Search recipients</label> {/* Label the search input. */}
                            <input
                                id="payee-search"
                                type="search"
                                value={payeeSearch} // Display current search text.
                                onChange={(event) => setPayeeSearch(event.target.value)} // Update on typing.
                            />

                            <fieldset>
                                <legend>Saved recipients</legend> {/* Name the selection group. */}

                                {matchingPayees.map((payee) => (
                                    <label className="payee-option" key={payee.id}>
                                        <input
                                            type="radio"
                                            name="saved-payee" // Group the options into one selection.
                                            value={payee.id}
                                            checked={selectedPayeeId === payee.id} // Mark the current selection.
                                            onChange={() => setSelectedPayeeId(payee.id)} // Remember the selected ID.
                                        />
                                        <span>
                                            {payee.name} — {payee.bank} · {payee.accountNumberMasked}
                                        </span>
                                    </label>
                                ))}
                            </fieldset>

                            {matchingPayees.length === 0 && (
                                <p role="status">No saved recipients found.</p>
                            )}
                        </div>

                    )}
                    {/* Place Continue AFTER the complete payees.isSuccess block above. */}
                    <button
                        type="button"
                        disabled={!selectedPayeeId} // Require a selected recipient.
                        onClick={() => setStep('amount')} // Display the amount step.
                    >
                        Continue
                    </button>
                </section>
            )}

            {/* Step: Amount goes OUTSIDE the recipient section, before the dialog closes. */}
            {step === 'amount' && (
                <form
                    noValidate // Use our central rules instead of browser validation messages.
                    onSubmit={handleSubmit(() => setStep('review'))} // Continue only if valid.
                >
                    <h3 ref={stepHeadingRef} tabIndex={-1}>How much?</h3>

                    <label htmlFor="from-account">From account</label>
                    <select
                        id="from-account"
                        {...register('fromAccountId')} // Connect the account field.
                        aria-invalid={Boolean(errors.fromAccountId)}
                        aria-describedby={errors.fromAccountId ? 'account-error' : undefined}
                    >
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name} — {account.maskedNumber}
                            </option>
                        ))}
                    </select>
                    {errors.fromAccountId && (
                        <p id="account-error" role="alert">{errors.fromAccountId.message}</p>
                    )}

                    <p>Available balance: {formatMoney(selectedAccount?.balance ?? 0)}</p>
                    <p>Remaining daily limit: {formatMoney(remainingLimit)}</p>

                    <label htmlFor="transfer-amount">Amount (SGD)</label>
                    <input
                        id="transfer-amount"
                        type="text"
                        inputMode="decimal" // Request a decimal keyboard on supported phones.
                        {...register('amount')} // Connect the amount field.
                        aria-invalid={Boolean(errors.amount)}
                        aria-describedby={errors.amount ? 'amount-error' : undefined}
                    />
                    {errors.amount && (
                        <p id="amount-error" role="alert">{errors.amount.message}</p>
                    )}

                    <div>
                        {[50, 100, 250, 500].map((amount) => (
                            <button
                                key={amount}
                                type="button" // Quick amounts must not submit the form.
                                onClick={() => setValue('amount', String(amount), {
                                    shouldValidate: true, // Check the newly selected amount.
                                    shouldDirty: true, // Record that the value changed.
                                })}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>

                    <label htmlFor="transfer-note">Note (optional)</label>
                    <input
                        id="transfer-note"
                        {...register('note')} // Connect the note field.
                        aria-invalid={Boolean(errors.note)}
                        aria-describedby={errors.note ? 'note-count note-error' : 'note-count'}
                    />
                    <p id="note-count">{note.length}/50 characters</p>
                    {errors.note && (
                        <p id="note-error" role="alert">{errors.note.message}</p>
                    )}

                    <button type="button" onClick={() => setStep('recipient')}>Back</button>
                    <button type="submit">Continue</button> {/* Run validation before advancing. */}
                </form>
            )}
            {step === 'review' && !transfer.isSuccess && (
                <section aria-labelledby="review-heading">
                    <h3 id="review-heading" ref={stepHeadingRef} tabIndex={-1}>
                        Check the details
                    </h3>

                    <dl>
                        <dt>From account</dt>
                        <dd>{selectedAccount?.name} — {selectedAccount?.maskedNumber}</dd>

                        <dt>Recipient</dt>
                        {/* <dd>{selectedPayee?.name}</dd> */}
                        <dd>{recipientName}</dd>

                        <dt>Account number</dt>
                        {/* <dd>{selectedPayee?.accountNumberMasked}</dd> */}
                        <dd>{recipientMaskedNumber}</dd>

                        <dt>Bank</dt>
                        {/* <dd>{selectedPayee?.bank}</dd> */}
                        <dd>{recipientBank}</dd>

                        <dt>Amount</dt>
                        <dd>{formatMoney(Number(amountText))}</dd>

                        <dt>Fee</dt>
                        <dd>{formatMoney(0)}</dd> {/* The API specifies zero fee. */}

                        <dt>Total</dt>
                        <dd>{formatMoney(Number(amountText))}</dd> {/* Total equals amount with zero fee. */}

                        <dt>Note</dt>
                        <dd>{note || '—'}</dd> {/* Show a dash when no note was entered. */}
                    </dl>

                    {/* Step: Keep Review intact after a failed request. */}
                    {transfer.isError && (
                        <div role="alert">
                            <p>Something went wrong. Your money hasn't left your account. Try again.</p>
                            <p>{transfer.error.message}</p> {/* Include the returned error message. */}
                            {/* Step: Show why the API rejected the saved recipient. */}
                            {payeeError && <p>{payeeError}</p>}
                        </div>
                    )}
                    {/* Step: Show field-specific API errors without leaving Review. */}
                    {transfer.isError && (
                        <ul>
                            {(['fromAccountId', 'amount', 'note'] as const).map((field) =>
                                errors[field]?.type === 'server' ? (
                                    <li key={field}>{errors[field]?.message}</li>
                                ) : null,
                            )}
                        </ul>
                    )}
                    {/* Show recipient field errors while preserving Review after failure. */}
                    {transfer.isError && recipientMode === 'new' && (
                        <div>
                            {(['name', 'accountNumber', 'bank'] as const).map((field) =>
                                recipientErrors[field]?.type === 'server' ? (
                                    <p key={field}>{recipientErrors[field]?.message}</p>
                                ) : null,
                            )}
                        </div>
                    )}
                    <button
                        type="button"
                        disabled={transfer.isPending}
                        onClick={() => {
                            transfer.reset() // Clear the previous request error.
                            setStep('amount')
                        }}
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        disabled={transfer.isPending}
                        onClick={() => void confirmTransfer()} // Validate, then submit.
                    >
                        {transfer.isPending ? 'Sending…' : 'Confirm transfer'}
                    </button>
                </section>
            )}
            {/* Step: Display only API-confirmed success. */}
            {transfer.isSuccess && (
                <section aria-live="polite">
                    <h3 ref={stepHeadingRef} tabIndex={-1}>Transfer sent</h3>
                    <p>
                        {formatMoney(transfer.data.transfer.amount)} to{' '}
                        {transfer.data.transfer.recipient.name}
                    </p>
                    <p>The money should arrive within minutes.</p>
                    <p>Reference: {transfer.data.transfer.reference}</p>
                    <button type="button" onClick={onClose}>
                        Back to dashboard
                    </button>
                </section>
            )}
        </dialog>
    )
}
