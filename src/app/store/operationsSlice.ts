import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Operation } from '../../homeworks/ts1/3_write';
import { initialOperations } from './initialOperations';

export const operationsSlice = createSlice({
  name: 'operations', initialState: { items: initialOperations },
  reducers: {
    operationsAppended: (state, action: PayloadAction<Operation[]>) => { state.items.push(...action.payload); },
    operationAdded: (state, action: PayloadAction<Operation>) => { state.items.unshift(action.payload); },
    operationUpdated: (state, action: PayloadAction<Operation>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
  },
});

export const { operationsAppended, operationAdded, operationUpdated } = operationsSlice.actions;
