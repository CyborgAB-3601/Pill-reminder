
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Calendar, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

import { useReminderStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import PillCard from '@/components/PillCard';
import { PageTransition } from '@/components/ui/page-transition';

export default function Index() {
  const { reminders, getNextReminder } = useReminderStore();
  const [nextReminder, setNextReminder] = useState(getNextReminder());
  
  // Update next reminder whenever reminders change
  useEffect(() => {
    setNextReminder(getNextReminder());
  }, [reminders, getNextReminder]);
  
  // Format today's date
  const today = format(new Date(), 'EEEE, MMMM d');
  
  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-semibold tracking-tight">Welcome to PillMinder</h1>
              <p className="text-muted-foreground mt-1">
                <Calendar className="inline-block w-4 h-4 mr-1" />{today}
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/set-reminder" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Link>
            </Button>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-medium mb-4">Next Medication</h2>
              
              {nextReminder ? (
                <PillCard reminder={nextReminder} isNext={true} />
              ) : (
                <Card className="pill-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center text-center py-6">
                      <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No upcoming reminders</h3>
                      <p className="text-muted-foreground max-w-sm">
                        You don't have any upcoming medication reminders. Add your first reminder to get started.
                      </p>
                      <Button asChild className="mt-4">
                        <Link to="/set-reminder">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Reminder
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Recent Reminders</h2>
                {reminders.length > 0 && (
                  <Button variant="ghost" asChild size="sm">
                    <Link to="/reminders">View all</Link>
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {reminders.length > 0 ? (
                  reminders
                    .sort((a, b) => {
                      // Show most recent first (excluding next reminder)
                      if (nextReminder && a.id === nextReminder.id) return -1;
                      if (nextReminder && b.id === nextReminder.id) return 1;
                      
                      // Sort by date and time
                      const dateCompare = b.date.localeCompare(a.date);
                      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
                    })
                    .slice(0, 3) // Show only 3 reminders on the home page
                    .map((reminder) => (
                      <PillCard 
                        key={reminder.id} 
                        reminder={reminder}
                        isNext={nextReminder && reminder.id === nextReminder.id}
                      />
                    ))
                ) : (
                  <Card className="pill-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col items-center justify-center text-center py-6">
                        <p className="text-muted-foreground">
                          You haven't set any reminders yet.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
