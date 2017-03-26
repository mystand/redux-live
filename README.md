## Instalation

```bash
npm install --save https://bitbucket.org/mystand/mystand-redux-requests.git
```

#### Install saga

```ecmascript 6
// After store initialization
sagaMiddleware.run(rootSaga, store.dispatch)


// In root saga creation
import { buildRequestsSaga } from 'mystand-redux-requests'
import Api from 'path/to/api'

export default function *rootSaga(dispatch) {
  const requestsSaga = buildRequestsSaga(Api, dispatch)

  yield [
    // ...
    requestsSaga()
  ]
}
```

#### Install reducer

```ecmascript 6
import { combineReducers } from 'redux'
import { requestsReducer } from 'mystand-redux-requests'

const reducers = {
  // ... your other reducers here ...
  requests: formReducer     // <---- Mounted at 'requests'
}
const reducer = combineReducers(reducers)
```

## Usage

#### Create actions

```ecmascript 6
// actions/actsActions

import { requestsActionsHelper } from 'mystand-redux-requests'

const { generateIndex, generateGet, generateCreate } = requestsActionsHelper

export const index = generateIndex('acts') // calls Api.acts.index method
export const get = generateGet('acts') // calls Api.acts.get method
export const create = generateCreate('acts') // calls Api.acts.create method
```

#### Connect to component

```flow js
type RequestResultType<T> = {
  data: T,
  failureError: any,
  dataError: any,
  loading: boolean
}

type ActType = { 
  // ...
} 

type PropsType = {
  actsResult: RequestResultType<Array<ActType>>  
}

const ActsPage = (props: PropsType) => {
  const { actsResult } = props
  if (actsResult == null || actsResult.loading) return <div>Loading</div>
  if (actsResult.failureError || actsResult.dataError) return <div>Error</div>

  const acts = actsResult.data
  // ...  
}

export default connectWithRequests([
  {
    key: 'acts',
    action: () => actsActions.index()
  }
])(ActsPage)
```

#### Dispatch one action

```flow js
// actions/issuesActions

import { requestsActionsHelper } from 'mystand-redux-requests'
const { generateCreate } = requestsActionsHelper

export const create = generateCreate('acts') // calls Api.acts.create method
```

```flow js
import * as issuesActions from 'actions/issuesActions'

const CreateIssueModal = (props: PropsType) => {
  const { handleSubmit, dispatchRequest } = props // <- get dispatchRequest from props 

  const onSubmit = handleSubmit((values: HashType) => {
    const params = { record: values }
    const requestKey = 'createIssue'
    dispatchRequest(issuesActions.create(requestKey, params)) // <- use dispatchRequest with any requestKey
  })

  return (
    // ...
  )
}

export default R.compose(
  reduxForm({ form: 'createIssue' }),
  connectWithRequests([])
)(CreateIssueModal)
```

#### Customize api method name in action creator
 
 ```flow js
 import { requestsActions } from 'mystand-redux-requests'
 
 // this methos calls Api.project.dashboard
 export const dashboard = (requestKey: string, params?: HashType, options?: OptionsType) => ({
   type: requestsActions.REQUEST_START,
   method: 'dashboard',
   dataType: 'project',
   requestKey, params, options
})
```

#### Infinity scroll 

There are two merge option values. `replace` (by default) and `append` (`append` for arrays only)

```flow js
export default connectWithRequests([
  {
    key: 'messages',
    cacheKey: (props: PropsType, state: StateType) => state.offset.toString(),
    action: (props: PropsType, state: StateType) => {
      const { offset } = state
      return messagesActions.index(null, { offset, limit: LIMIT }, { merge: 'append' }) // <- use merge: append
    }
  }
])(ProjectIssuePage)
```