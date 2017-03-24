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

```ecmascript 6
const ActsPage = (props) => {
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

