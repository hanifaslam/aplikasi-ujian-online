import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  nis: z.string().min(5, 'NIS minimal 5 karakter'),
  jurusan: z.string().nonempty('Jurusan wajib dipilih'),
});

type FormValues = z.infer<typeof schema>;

export default function AddParticipantForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      <div >
        <label>Nama</label>
        <input {...register('nama')} className="border p-2 w-full" />
        {errors.nama && <p className="text-red-500">{errors.nama.message}</p>}
      </div>

      <div>
        <label>NIS</label>
        <input {...register('nis')} className="border p-2 w-full" />
        {errors.nis && <p className="text-red-500">{errors.nis.message}</p>}
      </div>

      <div>
        <label>Jurusan</label>
        <select {...register('jurusan')} className="border p-2 w-full">
          <option value="">-- Pilih Jurusan --</option>
          <option value="RPL">RPL</option>
          <option value="TKJ">TKJ</option>
          <option value="TEPPS">TEPPS</option>
        </select>
        {errors.jurusan && <p className="text-red-500">{errors.jurusan.message}</p>}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
