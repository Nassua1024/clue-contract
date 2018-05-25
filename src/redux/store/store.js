import { createStore, combineReducers } from 'redux';
import * as reducer from '../reducer/reducers';

// 创建一个 Redux Store 来存放应用中所有的 state, 应用中应有且仅有一个store

const store = createStore(
    combineReducers(reducer)
)

export default store;
