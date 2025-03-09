
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Plus, Filter, Search, CalendarRange, CheckSquare, XSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PillCard from '@/components/PillCard';
import { PageTransition } from '@/components/ui/page-transition';
import { useReminderStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Reminders() {
  const { reminders } = useReminderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Group reminders by date
  const remindersByDate = reminders.reduce((acc, reminder) => {
    if (!acc[reminder.date]) {
      acc[reminder.date] = [];
    }
    acc[reminder.date].push(reminder);
    return acc;
  }, {} as Record<string, typeof reminders>);
  
  // Sort dates
  const sortedDates = Object.keys(remindersByDate).sort((a, b) => {
    if (sortBy === 'newest') {
      return b.localeCompare(a);
    } else {
      return a.localeCompare(b);
    }
  });
  
  // Filter reminders based on search
  const filteredDates = sortedDates.filter(date => {
    if (!searchTerm) return true;
    
    return remindersByDate[date].some(reminder => 
      reminder.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const upcomingReminders = reminders.filter(r => !r.taken && new Date(r.date) >= new Date());
  const pastReminders = reminders.filter(r => r.taken || new Date(r.date) < new Date());
  
  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="font-semibold tracking-tight">All Reminders</h1>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/set-reminder" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Link>
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reminders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <CalendarRange className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                <XSquare className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="taken" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Taken
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-8">
              {filteredDates.length > 0 ? (
                filteredDates.map(date => (
                  <div key={date}>
                    <h3 className="text-md font-medium mb-4 text-muted-foreground">
                      {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="space-y-4">
                      {remindersByDate[date]
                        .filter(reminder => 
                          searchTerm ? 
                            reminder.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
                          : true
                        )
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(reminder => (
                          <PillCard key={reminder.id} reminder={reminder} />
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reminders found</p>
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingReminders.length > 0 ? (
                upcomingReminders
                  .filter(reminder => 
                    searchTerm ? 
                      reminder.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    : true
                  )
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
                  })
                  .map(reminder => (
                    <PillCard key={reminder.id} reminder={reminder} />
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming reminders</p>
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="taken" className="space-y-4">
              {pastReminders.length > 0 ? (
                pastReminders
                  .filter(reminder => 
                    searchTerm ? 
                      reminder.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    : true
                  )
                  .sort((a, b) => {
                    const dateCompare = b.date.localeCompare(a.date);
                    return dateCompare !== 0 ? dateCompare : b.time.localeCompare(a.time);
                  })
                  .map(reminder => (
                    <PillCard key={reminder.id} reminder={reminder} />
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No taken reminders</p>
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </PageTransition>
    </>
  );
}
