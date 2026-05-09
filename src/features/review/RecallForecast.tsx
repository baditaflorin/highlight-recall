import { CalendarDays, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { recallForecast } from '../../domain/spacedRepetition'
import type { Highlight } from '../../domain/types'

type Props = {
  highlights: Highlight[]
}

export function RecallForecast({ highlights }: Props) {
  const forecast = useMemo(() => recallForecast(highlights, 14), [highlights])
  const maxCount = useMemo(() => Math.max(...forecast.map((f) => f.count), 5), [forecast])

  return (
    <section className="panel forecast-panel" aria-labelledby="forecast-heading">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Retention Forecast</p>
          <h2 id="forecast-heading">Upcoming reviews</h2>
        </div>
        <div className="counter-pill">
          <CalendarDays aria-hidden="true" />
          Next 14 days
        </div>
      </header>

      <div className="forecast-chart">
        {forecast.map((day, i) => {
          const date = new Date(day.date)
          const isToday = i === 0
          const height = (day.count / maxCount) * 100

          return (
            <div key={day.date} className="forecast-day" title={`${day.count} reviews on ${date.toLocaleDateString()}`}>
              <div className="bar-wrapper">
                <div 
                  className={`bar ${isToday ? 'is-today' : ''}`} 
                  style={{ height: `${height}%` }}
                >
                  {day.count > 0 && <span className="bar-count">{day.count}</span>}
                </div>
              </div>
              <span className="day-label">
                {isToday ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
            </div>
          )
        })}
      </div>

      <div className="forecast-summary">
        <TrendingUp aria-hidden="true" className="text-gradient" />
        <p>
          You have <strong>{forecast.reduce((a, b) => a + b.count, 0)}</strong> highlights scheduled for review over the next two weeks.
        </p>
      </div>
    </section>
  )
}
