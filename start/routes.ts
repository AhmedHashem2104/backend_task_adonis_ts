/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const ContentsController = () => import('#controllers/contents_controller')
const FavoritesController = () => import('#controllers/favorites_controller')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger", swagger); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", swagger); to use RapiDoc instead
})

router
  .group(() => {
    router
      .group(() => {
        router.get(`/checkAuth`, [AuthController, 'auth'])
        router.get(`/logout`, [AuthController, 'logout'])
        router.resource(`/content`, ContentsController)
        router.post(`/history/:content_id`, [FavoritesController, 'addToHistory'])
        router.get(`/history`, [FavoritesController, 'retrieveHistory'])
        router.post(`/favorite/:content_id`, [FavoritesController, 'addToFavorite'])
        router.delete(`/favorite/:content_id`, [FavoritesController, 'deleteFavorite'])
        router.put(`/updateUser`, [AuthController, 'updateUser'])
      })
      .use(middleware.auth())
    router
      .group(() => {
        router.post(`/register`, [AuthController, 'register'])
        router.post(`/login`, [AuthController, 'login'])
      })
      .prefix(`/auth`)
  })
  .prefix(`/api/v1`)
