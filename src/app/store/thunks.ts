import { appInitialized, createDemoToken, signedIn } from './sessionSlice';
import { readToken } from './tokenStorage';
import { createRandomOperation } from '../../homeworks/ts1/3_write';
import { operationAdded, operationUpdated, operationsAppended } from './operationsSlice';
import type { OperationDraft } from '../../features/forms/OperationForm/types';
import type { AppThunk } from './store';

export const initializeApplication = (): AppThunk => (dispatch, getState, { storage }) => {
  if (getState().auth.initialized) return;
  dispatch(appInitialized(readToken(storage)));
};

export const signIn = (email: string, mode: 'login' | 'register'): AppThunk => (dispatch) => {
  dispatch(signedIn(createDemoToken(email, mode)));
};

export const loadMoreOperations = (): AppThunk => (dispatch) => {
  const createdAt = new Date().toISOString();
  dispatch(operationsAppended(Array.from({ length: 6 }, () => createRandomOperation(createdAt))));
};

export const saveOperation = (draft: OperationDraft, id?: string): AppThunk => (dispatch, getState) => {
  if (getState().auth.profile?.role !== 'admin') return;
  if (id) dispatch(operationUpdated({ ...draft, id }));
  else dispatch(operationAdded({ ...draft, id: crypto.randomUUID() }));
};
