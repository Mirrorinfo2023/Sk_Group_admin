export default async function handler(req, res) {
    try {

        const postData = {
            uid: req.body.uid
        };

        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        if (response.status === 200) {
            const jsonData = await response.json();

            const modifiedData = {
                secret_key: jsonData.secret_key,
            }
            res.status(200).json(modifiedData);

        } else if (response.status === 404) {
            res.status(404).json(response.data);
        } else {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}