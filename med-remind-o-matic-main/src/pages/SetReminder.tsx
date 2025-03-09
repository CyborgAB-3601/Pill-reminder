
import Header from '@/components/Header';
import ReminderForm from '@/components/ReminderForm';
import { PageTransition } from '@/components/ui/page-transition';
import { useSearchParams } from 'react-router-dom';

export default function SetReminder() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  
  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container">
          <h1 className="font-semibold tracking-tight mb-6">
            {editId ? 'Edit' : 'Add New'} Reminder
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <ReminderForm />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
