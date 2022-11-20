export const isValidEmail = (email) => {
	const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	return isValid.test(email);
};

export const getToken = () => localStorage.getItem("auth-token");

export const catchError = (error) => {
	const { response } = error;
	if (response?.data) return response.data;

	return { error: error.message || error };
}

export const renderItem = (result) => {
	return (
		<div key={result.id} className='flex space-x-2 rounded overflow-hidden'>
			<img src={result.avatar} alt={result.name} className="w-12 h-12 object-cover" />
			<p className='font-semibold'> {result.name} </p>
		</div>
	)
}

export const getPoster = (posters = []) => {
	const { length } = posters
	if (!length) return null
	//if it has more than items selecting second
	if (length > 2)
		return posters[1]

	//else selecting first
	return posters[0]
}

export const convertReviewCount = (count = 0) => {
	if (count <= 999) return count

	return parseFloat(count / 1000).toFixed(2) + 'k'
}