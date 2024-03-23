export default function SettingRow({ label, control }) {
  return (
    <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
      <div className='d-inline'>
        <span>{label}</span>
      </div>
      <div className='d-inline'>
        {control}
      </div>
    </div>
  );
}