import { z } from 'zod' // Define validation rules.
import type { Account } from '../api/types' // Describe the available accounts.
import { formatMoney } from './format' // Format dynamic error amounts.

// Step 1: Build rules using current account balances and daily allowance.
export function createAmountSchema(
  accounts: Account[],
  remainingLimit: number,
) {
  return z.object({
    fromAccountId: z.string().refine(
      (id) => accounts.some(
        (account) => account.id === id && account.type !== 'credit',
      ), // Accept only an available deposit account.
      'Choose an account to transfer from.',
    ),

    amount: z.string().trim()
      .min(1, 'Enter an amount.') // Require a value.
      .regex(/^\d+(\.\d{1,2})?$/, 'Use a valid amount with at most 2 decimal places.')
      .refine(
        (value) => Number(value) >= 1,
        'Enter an amount of at least SGD 1.00.',
      ),

    note: z.string().max(50, 'Keep the note to 50 characters or fewer.'),
  }).superRefine((values, context) => {
    // Step 2: Check rules that depend on other fields or API data.
    const account = accounts.find(
      (item) => item.id === values.fromAccountId,
    ) // Find the selected sender account.

    const amount = Number(values.amount) // Convert input text for comparison.
    if (!Number.isFinite(amount) || amount < 1) return // Leave basic errors to the rules above.

    if (account && amount > account.balance) {
      context.addIssue({
        code: 'custom',
        path: ['amount'], // Attach the error to the amount input.
        message: `Amount can't be more than your available balance (${formatMoney(account.balance)}).`,
      })
    }

    if (amount > remainingLimit) {
      context.addIssue({
        code: 'custom',
        path: ['amount'],
        message: `This transfer exceeds your remaining daily limit (${formatMoney(remainingLimit)}).`,
      })
    }
  })
}

// Step 3: Derive form types from the schema instead of defining them twice.
export type AmountFormValues = z.infer<
  ReturnType<typeof createAmountSchema>
>

// Step: Define new-recipient rules once, following the brief and API contract.
export const newRecipientSchema = z.object({
  name: z.string().trim()
    .min(2, 'Enter a recipient name (2–50 characters).')
    .max(50, 'Enter a recipient name (2–50 characters).'),

  accountNumber: z.string().trim()
    .regex(/^\d{8}$/, 'Enter a valid 8-digit account number.'),

  bank: z.string().trim()
    .min(2, 'Enter a bank name (2–30 characters).')
    .max(30, 'Enter a bank name (2–30 characters).'),
})

// Derive the form's TypeScript shape from those same rules.
export type NewRecipientFormValues = z.infer<typeof newRecipientSchema>