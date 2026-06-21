import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { LearningProvider } from '@/store/LearningContext';
import './app.scss';

function App(props) {
  useEffect(() => {});
  useDidShow(() => {});
  useDidHide(() => {});
  return <LearningProvider>{props.children}</LearningProvider>;
}

export default App;
