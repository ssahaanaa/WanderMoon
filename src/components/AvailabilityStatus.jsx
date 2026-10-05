function AvailabilityStatus({ loading, error, data, requested }) {
  if (loading) return <p className="availability-note">Checking availability...</p>;
  if (error) return <p className="field-error">{error}</p>;
  if (!data) return null;

  if (!data.available) {
    return <p className="field-error">Sold out on {data.date}. Please pick another date.</p>;
  }

  if (requested && requested > data.seatsLeft) {
    return (
      <p className="field-error">
        Only {data.seatsLeft} seat(s) left on {data.date}. Reduce the number of travelers.
      </p>
    );
  }

  return <p className="availability-note ok">{data.seatsLeft} seat(s) available on {data.date}.</p>;
}

export default AvailabilityStatus;
