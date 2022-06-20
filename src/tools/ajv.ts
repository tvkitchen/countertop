import Ajv from 'ajv'
import AjvKeywords from 'ajv-keywords'

export const ajv = new Ajv()
AjvKeywords(ajv, 'instanceof')
