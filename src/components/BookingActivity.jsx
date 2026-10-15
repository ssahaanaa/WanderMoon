import { useDispatch, useSelector } from "react-redux";
import { clearActivity } from "../store/activitySlice.js";

function BookingActivity() {
  const entries = useSelector((state) => state.activity.entries);
  const dispatch = useDispatch();

  return (
    <div className="booking-cart activity-log">
      <h3>Booking Activity</h3>

      {entries.length === 0 && <p>No booking actions yet.</p>}

      {entries.length > 0 && (
        <>
          <ul className="activity-list">
            {entries.slice(0, 8).map((entry) => (
              <li key={entry.id}>
                <span className="activity-time">{new Date(entry.at).toLocaleTimeString()}</span>
                <span>{entry.summary}</span>
              </li>
            ))}
          </ul>
          <button className="secondary" onClick={() => dispatch(clearActivity())}>
            Clear Activity
          </button>
        </>
      )}
    </div>
  );
}

export default BookingActivity;
