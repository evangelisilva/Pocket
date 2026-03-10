import { Route, Switch } from 'wouter';
import { MobileLayout } from './layout/MobileLayout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { EditExpense } from './pages/EditExpense';
import { ScanReceipt } from './pages/ScanReceipt';
import { ExpenseProvider } from './store/ExpenseContext';

function App() {
  return (
    <ExpenseProvider>
      <MobileLayout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/add" component={AddExpense} />
          <Route path="/edit/:id" component={EditExpense} />
          <Route path="/scan" component={ScanReceipt} />
          <Route>404: No such page!</Route>
        </Switch>
      </MobileLayout>
    </ExpenseProvider>
  );
}

export default App;
