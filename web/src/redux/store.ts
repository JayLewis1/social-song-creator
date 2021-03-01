import { createElement } from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { rootReducer,  RootState} from "./reducers";

const initialState = {};

const middleware = [thunk];

// const store = createStore(rootReducer, initialState,compose(composeWithDevTools(applyMiddleware(...middleware))) );

export const store = createStore(rootReducer,initialState, compose(composeWithDevTools(applyMiddleware(...middleware))));

export default store;