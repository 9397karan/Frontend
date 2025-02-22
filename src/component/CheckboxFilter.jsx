const CheckboxFilter = ({ options, selectedValues, onChange }) => {
    const handleCheckboxChange = (id) => {
        const updatedValues = new Set(selectedValues);

        if (updatedValues.has(id)) {
            updatedValues.delete(id);
        } else {
            updatedValues.add(id);
        }

        onChange([...updatedValues]); // Convert back to array to pass to parent
    };

    return (
        <div>
            {options.map((option) => (
                <div key={option.id} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id={option.id}
                        checked={selectedValues.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                        className="mr-2"
                    />
                    <label htmlFor={option.id} className="text-sm">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CheckboxFilter;

