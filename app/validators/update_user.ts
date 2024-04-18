import vine from '@vinejs/vine'

export const UpdateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(20).optional(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(16)
      .alphaNumeric({
        allowUnderscores: true,
      })
      .confirmed({
        confirmationField: 'passwordConfirmation',
      })
      .optional(),
  })
)
