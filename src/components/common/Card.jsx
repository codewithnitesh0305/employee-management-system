function Card({
  title,
  description,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        ${className}
      `}
    >
      {(title || description || action) && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-slate-200
            px-5
            py-4
          "
        >
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

export default Card;