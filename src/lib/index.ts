import { H3lp } from './application'
import { Utils, Validator, FsHelper, HttpHelper, ObjectHelper, StringHelper, TestHelper, ArrayHelper } from './infrastructure'
const val = new Validator()
const str = new StringHelper(val)
const array = new ArrayHelper()
const fs = new FsHelper()
const http = new HttpHelper(str)
const obj = new ObjectHelper(http, val)
const utils = new Utils(val, obj)
const test = new TestHelper(str, obj, utils, fs)
H3lp.add(val, str, array, fs, http, obj, utils, test)
export const h3lp = new H3lp()
export * from './domain'
export * from './application'
