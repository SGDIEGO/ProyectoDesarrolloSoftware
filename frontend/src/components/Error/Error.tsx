function ErrorComponent({ error }: { error: Error }) {
  return (
    <>
      <h1>ERROR</h1>
      <p>{error.message}</p>
    </>
  );
}

export { ErrorComponent };
