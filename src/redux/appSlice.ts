// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  companyId: string | null;
}

const initialState: AppState = {
  companyId: null,
}; 

const appSlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyId: (state, action: PayloadAction<string | null>) => {
      state.companyId = action.payload;
    },
    getCompanyId(state: any) {
      return state.companyId;
    },
  },
});

export const { setCompanyId, getCompanyId } = appSlice.actions;

export default appSlice.reducer;
