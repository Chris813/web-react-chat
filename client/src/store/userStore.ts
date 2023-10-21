import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  name: string;
  avatar: string;
  isLogin: boolean;
}

const initialState: UserState = {
  name: "",
  avatar: "",
  isLogin: false,
};

const user = createSlice({
  // 模块名称独一无二
  name: "user",
  // 初始数据
  initialState,
  // 修改数据的同步方法
  reducers: {
    loginSuccess(state, action) {
      console.log(action.payload);
      const { name } = action.payload;
      state.name = name;
      state.isLogin = true;
    },
    addAvatar(state, action) {
      const { avatar } = action.payload;
      state.avatar = avatar;
    },
    logOut(state) {
      state.name = "";
      state.avatar = "";
      state.isLogin = false;
    },
  },
});

const { loginSuccess, addAvatar, logOut } = user.actions;
const userReducer = user.reducer;

// 导出修改数据的函数
export { loginSuccess, addAvatar, logOut };
// 导出reducer
export default userReducer;
