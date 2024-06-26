import axios from 'axios';

const lista = async (address) => {
    address = address.toLowerCase();
    const url = `https://api.lista.org/api/points/s3/ranking?currentUser=${address}`;

    try {
        const response = await axios.get(url);
        const data = response.data.data.currentUser;

        // 检查数据是否为对象并且包含所需的字段
        if (data && typeof data === 'object') {
            const position = Number(data.position);
            const quest = parseInt(Number(data.final), 10);
            return { position, quest: quest };
        } else {
            // 如果数据不是对象或者不包含所需字段，返回默认值
            return { position: '-', quest: '-' };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // 重新抛出错误以便调用者处理
    }
};

export default lista;