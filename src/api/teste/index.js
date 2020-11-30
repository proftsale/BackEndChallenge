import { Router } from 'express'
import { middleware as query } from 'querymen'
import { narcissistic, ping, create, index, show, update, destroy } from './controller'

const router = new Router()


/**
 * @api {get} /v1 Ping teste
 * @apiName PingTeste
 * @apiGroup Teste
 * @apiSuccess {Object} Pong (Bool).
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Teste not found.
 */
router.get('/ping',
  ping)

  /**
 * @api {get} /v1 narcisista teste
 * @apiName narcisistaTeste
 * @apiGroup Teste
 * @apiSuccess {Object} Pong (Bool).
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Teste not found.
 */
router.get('/narcisista/:number',
  narcissistic)

//rotas do REST criadas pelo generator

/**
 * @api {post} /v1 Create teste
 * @apiName CreateTeste
 * @apiGroup Teste
 * @apiSuccess {Object} teste Teste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Teste not found.
 */
router.post('/',
  create)

/**
 * @api {get} /v1 Retrieve testes
 * @apiName RetrieveTestes
 * @apiGroup Teste
 * @apiUse listParams
 * @apiSuccess {Object[]} testes List of testes.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /v1/:id Retrieve teste
 * @apiName RetrieveTeste
 * @apiGroup Teste
 * @apiSuccess {Object} teste Teste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Teste not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /v1/:id Update teste
 * @apiName UpdateTeste
 * @apiGroup Teste
 * @apiSuccess {Object} teste Teste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Teste not found.
 */
router.put('/:id',
  update)

/**
 * @api {delete} /v1/:id Delete teste
 * @apiName DeleteTeste
 * @apiGroup Teste
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Teste not found.
 */
router.delete('/:id',
  destroy)

export default router
