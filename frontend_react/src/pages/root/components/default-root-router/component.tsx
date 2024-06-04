import { PageError } from 'app/common/components/page-error';
import { ErrorBoundary } from 'app/components/error-boundary';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundary name="router" />,
    children: [
      {
        path: 'userProfile/:userId',
        async lazy() {
          const { UserProfilePage, userLoader } = await import(
            /* webpackChunkName: "pages.user-profile" */ 'app/pages/user-profile'
          );
          return { Component: UserProfilePage, loader: userLoader };
        },
      },
      {
        path: 'mission/:id',
        async lazy() {
          const { SudokuPage, sudokuLoader } = await import(
            /* webpackChunkName: "pages.sudoku.sudoku" */ 'app/pages/sudoku/component'
          );
          return { Component: SudokuPage, loader: sudokuLoader };
        },
      },
      {
        path: 'create',
        async lazy() {
          const { SudokuCreatePage } = await import(
            /* webpackChunkName: "pages.sudoku.sudoku-create" */ 'app/pages/sudoku-create'
          );
          return { Component: SudokuCreatePage };
        },
      },
      {
        path: '/',
        async lazy() {
          const { SudokuListPage, sudokuListLoader } = await import(
            /* webpackChunkName: "pages.sudoku.sudoku-list" */ 'app/pages/sudoku-list'
          );
          return { Component: SudokuListPage, loader: sudokuListLoader };
        },
      },
      {
        path: 'auth',
        children: [
          {
            path: 'signin',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-signin" */ 'app/pages/auth/auth-signin'
                  )
                ).default,
              };
            },
          },
          {
            path: 'activate',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-activation-prompt" */ 'app/pages/auth/auth-activation-prompt'
                  )
                ).default,
              };
            },
          },
          {
            path: 'signup',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-signup" */ 'app/pages/auth/auth-signup'
                  )
                ).default,
              };
            },
          },
          {
            path: 'activate/:token',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-activate-account" */ 'app/pages/auth/auth-activate-account'
                  )
                ).default,
              };
            },
          },
          {
            path: 'newPassword/:token',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-new-password" */ 'app/pages/auth/auth-new-password'
                  )
                ).default,
              };
            },
          },
          {
            path: 'forgotPassword',
            async lazy() {
              return {
                Component: (
                  await import(
                    /* webpackChunkName: "pages.auth.auth-forgot-password" */ 'app/pages/auth/auth-forgot-password'
                  )
                ).default,
              };
            },
          },
        ],
      },
    ],
  },
  { path: '*', element: <PageError message="Path not found" /> },
]);

export const DefaultRootRouter = () => {
  return <RouterProvider router={router} />;
};
