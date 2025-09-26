export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-6xl font-bold text-amaltech-orange mb-4">404</div>
      <h1 className="text-2xl font-bold text-amaltech-blue mb-6">
        Page Not Found
      </h1>
      <p className="text-amaltech-gray-600">
        The page you are looking for does not exist.
      </p>
    </section>
  );
}
