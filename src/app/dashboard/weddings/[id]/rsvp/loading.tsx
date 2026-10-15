
export default function RsvpLoading() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="animate-pulse space-y-2">
        <div className="h-8 w-56 rounded-lg bg-gray-200" />
        <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border p-4"
          >
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-8 w-14 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-10 rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="h-11 animate-pulse bg-gray-100" />
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="flex animate-pulse gap-4 border-t p-4"
          >
            <div className="h-4 flex-1 rounded bg-gray-100" />
            <div className="h-4 flex-1 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500" role="status">
        Cargando confirmaciones...
      </p>
    </main>
  );
}
