import Content from '#models/content'
import Favorite from '#models/favorite'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoritesController {
  async addToHistory({ params, auth, response }: HttpContext) {
    const checkContent = await Content.query().where('id', params.content_id).first()

    if (!checkContent)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    const checkAvailability = await Favorite.query()
      .where(`content_id`, params.content_id)
      .where(`user_id`, auth.user?.id!)
      .first()

    if (checkAvailability)
      return response.status(400).json({
        message: `Already added to history`,
      })

    const result = await Favorite.create({
      content_id: params.content_id,
      user_id: auth.user?.id,
    })

    return response.json(result)
  }

  async addToFavorite({ params, auth, response }: HttpContext) {
    const checkContent = await Content.query().where('id', params.content_id).first()

    if (!checkContent)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    const checkAvailability = await Favorite.query()
      .where(`content_id`, params.content_id)
      .where(`user_id`, auth.user?.id!)
      .first()

    let result: any = null

    if (checkAvailability)
      result = await Favorite.query().where(`id`, checkAvailability.id).update({
        is_favorite: true,
      })
    else
      result = await Favorite.create({
        content_id: params.content_id,
        user_id: auth.user?.id,
        is_favorite: true,
      })

    return response.json(result)
  }

  async deleteFavorite({ params, auth, response }: HttpContext) {
    const checkContent = await Content.query().where('id', params.content_id).first()

    if (!checkContent)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    const checkAvailability = await Favorite.query()
      .where(`content_id`, params.content_id)
      .where(`user_id`, auth.user?.id!)
      .first()

    if (!checkAvailability)
      return response.status(400).json({
        message: `Favorite does not exists`,
      })

    const result = await Favorite.query().where(`id`, checkAvailability.id).update({
      is_favorite: false,
    })

    return response.json(result)
  }

  async retrieveHistory({ response, auth, params }: HttpContext) {
    const result = await Favorite.query()
      .where(`user_id`, auth.user?.id!)
      .orderBy(`created_at`, 'desc')
      .paginate(params.page, 10)

    return response.json(result)
  }
}
