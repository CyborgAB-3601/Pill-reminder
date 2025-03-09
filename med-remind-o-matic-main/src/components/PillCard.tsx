
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Check, Clock, CalendarDays, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Reminder } from '@/types/reminder';
import { useReminderStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PillCardProps {
  reminder: Reminder;
  isNext?: boolean;
}

export default function PillCard({ reminder, isNext = false }: PillCardProps) {
  const navigate = useNavigate();
  const { markAsTaken, deleteReminder } = useReminderStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleMarkAsTaken = () => {
    markAsTaken(reminder.id, true);
    toast.success(`${reminder.medicineName} marked as taken`, {
      description: "Great job staying on top of your medication!",
    });
  };
  
  const handleEdit = () => {
    navigate(`/set-reminder?id=${reminder.id}`);
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteReminder(reminder.id);
      toast.success('Reminder deleted', {
        description: `${reminder.medicineName} has been removed from your schedule.`,
      });
    }, 300);
  };
  
  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1, height: 'auto' }}
        animate={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      />
    );
  }
  
  const formattedDate = format(parseISO(reminder.date), 'EEEE, MMMM d');
  const formattedTime = format(parseISO(`2000-01-01T${reminder.time}`), 'h:mm a');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={cn(
        "pill-shadow transition-all duration-300 overflow-hidden",
        isNext ? "border-primary/30" : "",
        reminder.taken ? "opacity-70" : ""
      )}>
        {isNext && (
          <div className="h-1.5 bg-primary w-full" />
        )}
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {isNext && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Next
                  </Badge>
                )}
                <h3 className="font-medium text-lg">{reminder.medicineName}</h3>
              </div>
              
              <p className="text-muted-foreground text-sm">{reminder.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
                  {formattedTime}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5 mr-1 text-primary/70" />
                  {formattedDate}
                </div>
                {reminder.dosage && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {reminder.dosage}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={handleEdit}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
            {!reminder.taken && (
              <Button
                size="sm"
                className="text-xs gap-1"
                onClick={handleMarkAsTaken}
              >
                <Check className="w-3.5 h-3.5" />
                Mark as Taken
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
