export function estimateScenario({inquiries,unfollowedPercent,bookingPercent,averageJobValue}) {
  const vals=[inquiries,unfollowedPercent,bookingPercent,averageJobValue].map(Number);
  if (vals.some(x => !Number.isFinite(x) || x < 0)) throw new RangeError('Use non-negative numbers.');
  const [n,missed,booked,value]=vals;
  if (missed>100 || booked>100 || n>100000 || value>10000000) throw new RangeError('Outside allowed scenario range.');
  const unattended=n*missed/100;
  const modeledBookings=unattended*booked/100;
  return {unattended,modeledBookings,scenarioValue:modeledBookings*value};
}
if (typeof document !== 'undefined') {
 const form=document.querySelector('#calculator');
 const output=document.querySelector('#estimate');
 const count=document.querySelector('#unattended');
 const bookings=document.querySelector('#modeled-bookings');
 const amount=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
 const num=new Intl.NumberFormat('en-US',{maximumFractionDigits:1});
 const update=()=>{
   try{
     const data=Object.fromEntries(new FormData(form).entries());
     const result=estimateScenario(data);
     count.textContent=num.format(result.unattended);
     bookings.textContent=num.format(result.modeledBookings);
     output.textContent=amount.format(result.scenarioValue);
   }catch{
     count.textContent='—';bookings.textContent='—';output.textContent='Check inputs';
   }
 };
 form.addEventListener('input',update);update();
}
