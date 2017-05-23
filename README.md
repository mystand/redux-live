## Installation

```bash
npm install --save https://github.com/mystand/redux-live.git
```

#### Install saga

```ecmascript6
// After store initialization
sagaMiddleware.run(rootSaga, store.dispatch)


// In root saga creation
import { buildRequestsSaga } from 'redux-live'
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

```ecmascript6
import { combineReducers } from 'redux'
import { requestsReducer } from 'redux-live'

const reducers = {
  // ... your other reducers here ...
  requests: formReducer     // <---- Mounted at 'requests'
}
const reducer = combineReducers(reducers)

```

## Usage

#### Create actions

```ecmascript6
// actions/actsActions

import { requestsActionsHelper } from 'redux-live'

const { generateIndex, generateGet, generateCreate } = requestsActionsHelper

export const index = generateIndex('acts') // calls Api.acts.index method(params)
export const get = generateGet('acts') // calls Api.acts.get method(params)
export const create = generateCreate('acts') // calls Api.acts.create method(params)
```

#### Connect to component

```flowjs
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

```flowjs
// actions/issuesActions

import { requestsActionsHelper } from 'redux-live'
const { generateCreate } = requestsActionsHelper

export const create = generateCreate('acts') // calls Api.acts.create method
```

```flowjs
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
 
```flowjs

 import { requestsActions } from 'redux-live'
 
 // this methos calls Api.project.dashboard(params)
 // params will be same as params from action
 export const dashboard = (requestKey: string, params?: HashType, options?: OptionsType) => ({
   type: requestsActions.REQUEST_START,
   method: 'dashboard',
   dataType: 'project',
   requestKey, params, options
})

```

#### Infinity scroll 

There are two merge option values. `replace` (by default) and `append` (`append` for arrays only)

```flowjs
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

#### Subscriptions 

You can white condition using syntax provided by [JEXT](https://www.npmjs.com/package/jexl) 

```flowjs
export default connectWithRequests([
  {
    key: 'issues',
    cacheKey: (props: PropsType) => props.params.projectId,
    action: (props: PropsType) => issuesActions.index(null, { projectId: props.params.projectId }, {
      subscribe: {
        model: 'Issue',
        condition: `o.project_id == ${props.params.projectId}` // see https://www.npmjs.com/package/jexl
      }
    })
  }
])(ProjectSupportPage)
```

#### Ordering 

It correctly works with subscriptions

```flowjs
export default connectWithRequests([
  {
    key: 'issues',
    cacheKey: (props: PropsType) => props.orderField,
    action: (props: PropsType) => issuesActions.index(null, {}, {
      comparator: (a, b) => a[props.orderField] - b[props.orderField],
      subscribe: { model: 'Issue' }
    })
  }
])(IssuesPage)
```

#### Subscription query scoping

If it needs you can use `getUrlOptions` parameter to custom your get/index subscription requests, this option fully supported by changes-notifier server.

```flowjs
export default connectWithRequests([
  {
    key: 'issues',
    cacheKey: (props: PropsType) => props.orderField,
    action: (props: PropsType) => issuesActions.index(null, {}, {
      comparator: (a, b) => a[props.orderField] - b[props.orderField],
      subscribe: { 
        model: 'Issue', 
        getUrlOptions: {
          showHidden: true
        }
      }
    })
  }
])(IssuesPage)
```


