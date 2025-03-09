
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useReminderStore } from '@/lib/store';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  description: z.string().optional(),
  dosage: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Valid time format is required (HH:MM)'),
  recurring: z.boolean().default(false),
  recurringDays: z.array(z.string()).optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: format(parse(`${hour}:${minute}`, 'H:m', new Date()), 'h:mm a'),
  };
});

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
];

export default function ReminderForm() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const navigate = useNavigate();
  const { reminders, addReminder, editReminder } = useReminderStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineName: '',
      description: '',
      dosage: '',
      date: new Date(),
      time: '08:00',
      recurring: false,
      recurringDays: [],
      color: 'blue',
    },
  });
  
  const recurring = form.watch('recurring');
  
  // If editing, populate the form with existing data
  useEffect(() => {
    if (editId) {
      const reminderToEdit = reminders.find(r => r.id === editId);
      if (reminderToEdit) {
        form.reset({
          medicineName: reminderToEdit.medicineName,
          description: reminderToEdit.description || '',
          dosage: reminderToEdit.dosage || '',
          date: new Date(reminderToEdit.date),
          time: reminderToEdit.time,
          recurring: reminderToEdit.recurring || false,
          recurringDays: reminderToEdit.recurringDays || [],
          color: reminderToEdit.color || 'blue',
        });
      }
    }
  }, [editId, reminders, form]);
  
  const onSubmit = (data: FormValues) => {
    const reminderData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };
    
    if (editId) {
      editReminder(editId, reminderData);
      toast.success('Reminder updated', {
        description: `${data.medicineName} has been updated in your schedule.`,
      });
    } else {
      addReminder(reminderData);
      toast.success('Reminder added', {
        description: `${data.medicineName} has been added to your schedule.`,
      });
    }
    
    navigate('/');
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="medicineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter medicine name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1 tablet, 5ml, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Label</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={cn("w-4 h-4 rounded-full mr-2", color.class)} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any details or instructions"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parse(field.value, 'HH:mm', new Date()), 'h:mm a')
                        ) : (
                          <span>Select time</span>
                        )}
                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <ScrollArea className="h-72">
                      <div className="p-2">
                        {timeOptions.map((time) => (
                          <Button
                            key={time.value}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              field.value === time.value && "bg-primary/10 text-primary"
                            )}
                            onClick={() => {
                              field.onChange(time.value);
                              document.dispatchEvent(new Event('popover-close'));
                            }}
                          >
                            {time.label}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Recurring Reminder
                </FormLabel>
                <FormDescription>
                  Set this medication to repeat on specific days
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {recurring && (
          <FormField
            control={form.control}
            name="recurringDays"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Repeat on</FormLabel>
                  <FormDescription>
                    Select the days when this medication should be taken
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {days.map((day) => (
                    <FormItem
                      key={day.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(day.value)}
                          onCheckedChange={(checked) => {
                            const updatedDays = checked
                              ? [...(field.value || []), day.value]
                              : (field.value || []).filter(
                                  (value) => value !== day.value
                                );
                            field.onChange(updatedDays);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {day.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {editId ? 'Update' : 'Add'} Reminder
          </Button>
        </div>
      </form>
    </Form>
  );
}
