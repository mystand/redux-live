// @flow
import R from 'ramda'

R.isDate = R.is(Date)

R.log = (argument) => {
  console.log(argument) // eslint-disable-line no-console
  return argument
}

R.isPresent = x => !R.isNil(x) && !R.isEmpty(x)

R.isString = R.is(String)

R.toggle = R.curry((value, array) => {
  return array.includes(value)
    ? R.without([value], array)
    : [...array, value]
})

R.updatePath = R.curry((path, fn, object) => {
  const value = fn(R.path(path, object))
  return R.assocPath(path, value, object)
})

R.replaceBy = R.curry((fn, value, array) => {
  const index = R.findIndex(fn, array)
  return R.update(index, value, array)
})