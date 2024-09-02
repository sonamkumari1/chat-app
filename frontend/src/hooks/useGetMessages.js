import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                if (!selectedConversation?._id) {
                    throw new Error('No conversation selected');
                }
                const response = await fetch(`/api/messages/${selectedConversation._id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                setMessages(data);  // Update messages in state
            } catch (error) {
                toast.error(error.message || 'An unexpected error occurred');  // Show error notification
                console.error("Fetch error:", error);  // Log the error for debugging
            } finally {
                setLoading(false);  // Set loading to false after the fetch is complete
            }
        };

        if (selectedConversation?._id) {
            getMessages();  // Fetch messages if a conversation is selected
        }

    }, [selectedConversation?._id, setMessages]);  // Dependency array to re-run on changes

    return { messages, loading };  // Return messages and loading state
};

export default useGetMessages;
