import React from 'react';
import Auth from '../../components/Auth/Auth';
import styles from './Login.module.css';

const Login = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <h1>Login / Sign Up</h1>
        <div className={styles.authWrapper}>
          <Auth isModal={false} />
        </div>
      </div>
    </div>
  );
};

export default Login;
