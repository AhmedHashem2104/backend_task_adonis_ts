import vine from '@vinejs/vine'

export const AddContentValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(20),
    media: vine.file({
      size: 500000,
      extnames: ['png', 'svg', 'jpg', 'jpeg', 'mp4', 'mp3'],
    }),
  })
)
