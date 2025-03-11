import {useContext, useState} from "react";
import songContext from "../../contexts/songContext";
import {Icon} from "@iconify/react";
import AddToPlaylistModal2 from "../../modals/AddtoPlaylistModal2";
import { makeAuthenticatedPOSTRequest } from "../../utils/serverHelpers";
import { backendUrl } from "../../utils/config";
import Cookies from "js-cookie";

const DeleteSongCard = ({info, playSound, onDelete}) => {
    const {currentSong, setCurrentSong} = useContext(songContext);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

    const addSongToPlaylist = async (playlistId) => {
        const songId = currentSong._id;

        const payload = {playlistId, songId};
        const response = await makeAuthenticatedPOSTRequest(
            "/playlist/add/song",
            payload
        );
        if(response._id){
            setAddToPlaylistModalOpen(false)
        }
    };

    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const handleCardClick = () => {
        setCurrentSong(info);
        setOverlayVisible(true); // Show the overlay on card click
    };

    const handleCloseOverlay = () => {
        setOverlayVisible(false); // Hide the overlay
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this Recipe?");
        if (confirmed) {
            try {
                const token = Cookies.get('token'); // Retrieve the token from cookies
                const response = await fetch(`http:/localhost:8080/song/delete/${info._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Use token from cookies
                    },
                });
                if (response.ok) {
                    onDelete(info._id); // Call the parent component's delete handler
                    handleCloseOverlay(); // Close the overlay after deletion
                } else {
                    const errorData = await response.json();
                    alert(errorData.err || "Error deleting song.");
                }
            } catch (error) {
                console.error("Error deleting song:", error);
                alert("Error deleting song.");
            }
        }
    };
    return (
        <div
            className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm"
            onClick={() => {
                setCurrentSong(info);
            }}
        >
            <div
                className="w-12 h-12 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${info.thumbnail}")`,
                }}
            ></div>
            <div className="flex w-full">
            {addToPlaylistModalOpen && (
                <AddToPlaylistModal2
                    closeModal={() => {
                        setAddToPlaylistModalOpen(false);
                    }}
                    addSongToPlaylist={addSongToPlaylist}
                />
            )}
                <div className="text-white flex justify-center  flex-col pl-4 w-5/6">
                    <div className="cursor-pointer hover:underline">
                        {info.name}
                    </div>
                    <div className="text-xs text-gray-400 cursor-pointer hover:underline">
                        {info.artist.firstName + " " + info.artist.lastName}
                    </div>
                </div>
                <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
                <Icon
                            icon="ic:round-playlist-add"
                            fontSize={30}
                            className="cursor-pointer text-gray-500 hover:text-white"
                            onClick={() => {
                                setAddToPlaylistModalOpen(true);
                            }}
                        />
                         {/* <button
                            onClick={handleDelete}
                            className="mt-4 bg-white text-black px-2 py-1 rounded"
                        >
                            Delete
                        </button>  */}
                </div>
            </div>
        </div>
    );
};

export default DeleteSongCard;
