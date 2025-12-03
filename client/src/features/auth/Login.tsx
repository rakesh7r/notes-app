import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to Notes</h1>
        <p className={styles.subtitle}>Please sign in to continue</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const decoded: any = jwtDecode(credentialResponse.credential);
                dispatch(
                  setCredentials({
                    user: {
                      name: decoded.name,
                      email: decoded.email,
                      picture: decoded.picture,
                    },
                    token: credentialResponse.credential,
                  })
                );
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </div>
  );
};
