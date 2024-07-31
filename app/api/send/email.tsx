export function EmailTemplate({ firstName }: Readonly<{ firstName: string }>) {
  return (
    <div>
      <p>Hello {firstName},</p>
      <p>Welcome to Acme!</p>
    </div>
  )
}