import express from 'express'
import db from './db.ts'
import moment from 'moment'
import { authenticateSession } from './auth.ts'
import { getErrorMessage, isStringNumeric } from './functions.ts'
import type { ResultSetHeader } from 'mysql2'

const router = express.Router()

router.get('/', authenticateSession, async (req, res) => {
  try {
    const table = req.baseUrl.slice(1)

    const [result] = await db.query('SELECT * FROM ??', [table])

    res.send(result)
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const table = req.baseUrl.slice(1)
    const id = req.params.id

    const [result] = await db.query('SELECT * FROM ?? WHERE id = ?', [table, id])

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

// router.post('/', async (req, res) => {
//   try {
//     const table = req.baseUrl.slice(1)

//     if (req.body.parole) {
//       req.body.parole = bcrypt.hashSync(req.body.parole, 10)
//     }

//     const columns = Object.keys(req.body)
//     const values = Object.values(req.body)

//     const [result] = await db.query<ResultSetHeader>(
//       `INSERT INTO ?? (??) VALUES (?)`,
//       [table, columns, values]
//     )

//     res.json({
//       message: 'Added entry',
//       id: result.insertId,
//     })
//   } catch (err) {
//     res.status(500).json({ message: getErrorMessage(err) })
//   }
// })

router.post('/', authenticateSession, async (req, res) => {
  try {
    const table = req.baseUrl.slice(1)
    const data = req.body

    if (!Array.isArray(data) || data.length === 0 || !data.every((obj) => typeof obj === 'object'))
      return res.status(400).json({
        message: 'Request body must be an array of objects',
      })

    const columns = Object.keys(data[0])
    const values = data.map((row) => columns.map((col) => row[col]))

    if (!data.every((obj) => Object.keys(obj).length === columns.length))
      return res.status(400).json({ message: 'Inconsistent object shape' })

    const rowPlaceholders = '(' + columns.map(() => '?').join(', ') + ')'
    const placeholders = values.map(() => rowPlaceholders).join(', ')
    const flatValues = values.flat()

    const sql = `INSERT INTO ?? (${columns.map(() => '??').join(', ')}) VALUES ${placeholders}`

    const [result] = await db.query<ResultSetHeader>(sql, [table, ...columns, ...flatValues])

    const insertIds = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i)

    res.json({
      message: 'Added entries',
      affectedRows: result.affectedRows,
      insertIds,
    })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

// router.patch('/single/:id', authenticateSession, async (req, res) => {
//   const table = req.baseUrl.slice(1)
//   const column = table + '_id'
//   const id = req.params.id

//   if (req.body.parole) {
//     req.body.parole = bcrypt.hashSync(req.body.parole, 10)
//   }

//   const columns = Object.keys(req.body)
//   const columnSetters = Object.keys(req.body)
//     .map(() => '?? = ?')
//     .join(', ')

//   const values = Object.values(req.body).map((value) =>
//     !isNumeric(value) && moment(value, moment.ISO_8601, true).isValid()
//       ? moment(value).format('YYYY-MM-DD HH:mm:ss')
//       : value && (value.constructor === Array || typeof value === 'object')
//         ? JSON.stringify(value)
//         : value,
//   )

//   const setters = columns.flatMap((col, i) => [col, values[i]])

//   db.query(`UPDATE ?? SET ${columnSetters} WHERE ?? = ?`, [table, ...setters, column, id], (err) => {
//     if (err) {
//       res.status(500).json({ message: err.message })
//     } else {
//       res.json({ message: 'Updated entry: ' + id })
//     }
//   })
// })

router.patch('/', authenticateSession, async (req, res) => {
  try {
    const table = req.baseUrl.slice(1)
    const updates = req.body

    if (!Array.isArray(updates) || updates.length === 0)
      return res.status(400).json({ message: 'Invalid updates array' })

    const queries = updates
      .map((update) => {
        const id = update['id']
        delete update['id']

        if (!id || Object.keys(update).length === 0) return null

        // if (update.password) update.password = bcrypt.hashSync(update.password, 10)

        const columns = Object.keys(update)

        const columnSetters = columns.map((col) => `\`${col}\` = ?`).join(', ')

        const values = Object.values(update).map((value) =>
          !isStringNumeric(value) && moment(value as string, moment.ISO_8601, true).isValid()
            ? moment(value as string).format('YYYY-MM-DD HH:mm:ss')
            : value && (value.constructor === Array || typeof value === 'object')
              ? JSON.stringify(value)
              : value,
        )

        return {
          sql: `UPDATE \`${table}\` SET ${columnSetters} WHERE id = ?`,
          values: [...values, id],
        }
      })
      .filter(Boolean) as { sql: string; values: any[] }[]

    if (queries.length === 0) return res.status(400).json({ message: 'No valid updates' })

    await Promise.all(queries.map((q) => db.query(q.sql, q.values)))

    res.json({
      message: 'Updated entries successfully',
    })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

// router.delete('/single/:id', authenticateSession, async (req, res) => {
//   const table = req.baseUrl.slice(1)
//   const column = table + '_id'
//   const id = req.params.id

//   db.query(`DELETE FROM ?? WHERE ?? = ?`, [table, column, id], (err) => {
//     if (err) {
//       res.status(500).json({ message: err.message })
//     } else {
//       res.json({ message: 'Deleted entry: ' + id })
//     }
//   })
// })

router.delete('/', authenticateSession, async (req, res) => {
  try {
    const table = req.baseUrl.slice(1)
    const ids = req.body

    if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === 'number'))
      return res.status(400).json({
        message: 'Request body must be an array of ids',
      })

    await db.query(`DELETE FROM ?? WHERE id IN (?)`, [table, ids])

    res.json({
      message: `Deleted entries: ${ids.join(', ')}`,
    })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

export default router
