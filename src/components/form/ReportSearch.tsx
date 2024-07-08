import { Search as SearchIcon } from 'lucide-react';
import { DatepickerRange } from '../ui/datepicker-range';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import CneeSelect from './Cnee';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dispatch } from 'react';

export const formSchema = z.object({
  JOB_FROM: z.string().optional(),
  JOB_TO: z.string().optional(),
  TR_NO: z.string().optional(),
  BL_NO: z.string().optional(),
  CNEE_CODE: z.string().optional(),
  URGENT: z.string().optional(),
});

interface Props {
  search: {
    JOB_FROM?: string;
    JOB_TO?: string;
    TR_NO?: string;
    BL_NO?: string;
    CNEE_CODE?: string;
    URGENT?: string;
  };
  setSearch: Dispatch<{
    JOB_FROM?: string;
    JOB_TO?: string;
    TR_NO?: string;
    BL_NO?: string;
    CNEE_CODE?: string;
    URGENT?: string;
    random: number;
  }>;
}

export default function ReportSearch({ search, setSearch }: Props) {
  const { watch, setValue, handleSubmit, register } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: search,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setSearch({
      JOB_FROM: data.JOB_FROM
        ? dayjs(data.JOB_FROM).format('YYYYMMDD')
        : undefined,
      JOB_TO: data.JOB_TO ? dayjs(data.JOB_TO).format('YYYYMMDD') : undefined,
      TR_NO: data.TR_NO ?? '', // default value for TR_NO
      BL_NO: data.BL_NO ?? '', // default value for BL_NO
      CNEE_CODE: data.CNEE_CODE ?? '', // default value for CNEE_CODE
      URGENT: data.URGENT ?? '', // default value for URGENT
      random: Math.random(),
    });
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DatepickerRange
        date={{
          from: dayjs(watch('JOB_FROM')).toDate(),
          to: dayjs(watch('JOB_TO')).toDate(),
        }}
        setDate={(date) => {
          setValue('JOB_FROM', dayjs(date.from).format('YYYYMMDD'));
          setValue('JOB_TO', dayjs(date.to).format('YYYYMMDD'));
        }}
      />
      <CneeSelect
        className="w-[200px]"
        {...register('CNEE_CODE')}
        onChange={(event) => setValue('CNEE_CODE', event.target.value)}
        value={watch('CNEE_CODE')}
      />
      <Input
        className="w-[200px]"
        placeholder="TR_NO"
        {...register('TR_NO')}
      />
      <Input
        className="w-[200px]"
        placeholder="BL_NO"
        {...register('BL_NO')}
      />
      <Switch
        id="urgent"
        checked={watch('URGENT') === 'Y'}
        onCheckedChange={(value) => setValue('URGENT', value ? 'Y' : 'N')}
      />
      <Label htmlFor="urgent">Urgent</Label>
      <Button type="submit">
        <SearchIcon className="mr-1 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}