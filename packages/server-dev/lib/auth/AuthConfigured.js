/*
  Copyright 2020-2023 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

function Session({ children }) {
  const { data: session, status } = useSession();
  // If session is passed to SessionProvider from getServerSideProps
  // we won't have a loading state here.
  // But 404 uses getStaticProps so we have this for 404.
  if (status === 'loading') {
    return '';
  }
  return children(session);
}

function AuthConfigured({ authConfig, children, serverSession }) {
  const auth = { signIn, signOut, authConfig };

  return (
    <SessionProvider session={serverSession}>
      <Session>
        {(session) => {
          auth.session = session;
          return children(auth);
        }}
      </Session>
    </SessionProvider>
  );
}

export default AuthConfigured;
