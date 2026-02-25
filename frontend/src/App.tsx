import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataStructureVisualizer from './pages/DataStructureVisualizer';
import GitConflictSimulator from './pages/GitConflictSimulator';
import IndustryChallengeFeed from './pages/IndustryChallengeFeed';
import ChallengeWorkspace from './pages/ChallengeWorkspace';
import MyNotes from './pages/MyNotes';

// Root route with Layout wrapper
const rootRoute = createRootRoute({
  component: () => <Layout><Outlet /></Layout>,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold text-neon-green font-mono">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/" className="text-neon-cyan hover:underline">← Back to Dashboard</Link>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const dataStructuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data-structures',
  component: DataStructureVisualizer,
});

const gitConflictsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/git-conflicts',
  component: GitConflictSimulator,
});

const challengesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/challenges',
  component: IndustryChallengeFeed,
});

const challengeWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/challenges/$id',
  component: ChallengeWorkspace,
});

const myNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-notes',
  component: MyNotes,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dataStructuresRoute,
  gitConflictsRoute,
  challengesRoute,
  challengeWorkspaceRoute,
  myNotesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
