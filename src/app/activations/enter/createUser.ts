export async function createUser(formData: Record<string, string>){
  console.log('formData', formData)
  
  await fetch('/api/user', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
    .then((res) => console.log(res.body))
  
  // redirect('/activations')
}