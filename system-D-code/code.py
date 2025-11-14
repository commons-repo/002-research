import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial import KDTree
import tkinter as tk
from tkinter import filedialog, messagebox
import matplotlib.animation as animation
from mpl_toolkits.axes_grid1.inset_locator import inset_axes
import math

class PointCloudSorter:
    def __init__(self, root):
        self.root = root
        self.root.title("Point Cloud Cleaning and Sorting System")

        self.original_data = None  # Raw data before cleaning
        self.cleaned_data = None  # Data after removing duplicates
        self.sorted_data = None  # Data after sorting
        self.removed_duplicates = []  # Stores removed duplicate points

        # Create buttons
        self.load_button = tk.Button(root, text="Load Data (CSV)", command=self.load_csv)
        self.load_button.pack(pady=5)        
        
        # Add "Close?" Option with Radio Buttons
        self.close_var = tk.StringVar(value="Yes")  # Default: Yes
        self.close_label = tk.Label(root, text="Close Loop?")
        self.close_label.pack()
        self.close_yes = tk.Radiobutton(root, text="Yes", variable=self.close_var, value="Yes")
        self.close_no = tk.Radiobutton(root, text="No", variable=self.close_var, value="No")
        self.close_yes.pack()
        self.close_no.pack()

        self.sort_button = tk.Button(root, text="Sort Data", command=self.sort_points, state=tk.DISABLED)
        self.sort_button.pack(pady=5)

        # **Plot Type Selection (Scatter or Line)**
        self.plot_type_var = tk.StringVar(value="line")  
        tk.Label(root, text="Plot Type:").pack()
        tk.Radiobutton(root, text="Line with Markers", variable=self.plot_type_var, value="line").pack()
        tk.Radiobutton(root, text="Scatter", variable=self.plot_type_var, value="scatter").pack()

        self.plot_button = tk.Button(root, text="Plot Data", command=self.plot_results, state=tk.DISABLED)
        self.plot_button.pack(pady=5)

        self.save_button = tk.Button(root, text="Save Data (CSV)", command=self.save_csv, state=tk.DISABLED)
        self.save_button.pack(pady=5)

        # Create a frame to hold both the Text widget and the Scrollbar
        text_frame = tk.Frame(root)
        text_frame.pack(pady=5, fill=tk.BOTH, expand=True)

        # Create the Text Widget inside the frame
        self.text_area = tk.Text(text_frame, height=25, width=75, wrap=tk.WORD)  # wrap=tk.WORD ensures word-wrapping
        self.text_area.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Create a Scrollbar and link it to the Text Widget
        scrollbar = tk.Scrollbar(text_frame, command=self.text_area.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Attach the scrollbar to the text area
        self.text_area.config(yscrollcommand=scrollbar.set)

        # Initially disable editing
        self.text_area.insert(tk.END, "Details will appear here...\n")
        self.text_area.config(state=tk.DISABLED)

        # --- NEW: Add a button for animation ---
        self.animate_button = tk.Button(root, text="Animate NNS", command=self.animate_nns)
        self.animate_button.pack(pady=5)


    def load_csv(self):
        file_path = filedialog.askopenfilename(filetypes=[("CSV Files", "*.csv")])
        if not file_path:
            return

        try:
            self.original_data = pd.read_csv(file_path)  # Load raw data
            
            if not set(['X', 'Y']).issubset(self.original_data.columns):
                messagebox.showerror("Error", "CSV must have headers: X,Y")
                return

            # Ensure 'Z' column is included if it exists, otherwise default to 0
            if 'Z' in self.original_data.columns:
                self.original_data = self.original_data[['X', 'Y', 'Z']]
            else:
                self.original_data['Z'] = 0  # Add default Z=0 if missing

            original_size = len(self.original_data)  # Store size before cleaning

            # **Track removed duplicates**
            self.removed_duplicates = self.original_data[self.original_data.duplicated(subset=['X', 'Y'], keep='first')].copy()
            self.removed_duplicates["Original_Index"] = self.removed_duplicates.index

            # **Remove duplicates**
            self.cleaned_data = self.original_data.drop_duplicates(subset=['X', 'Y']).reset_index(drop=True)
            cleaned_size = len(self.cleaned_data)

            messagebox.showinfo("Success", f"Loaded {original_size} points. After cleaning: {cleaned_size} unique points.")

            # **Reset everything when a new file is loaded**
            self.sorted_data = None
            self.text_area.config(state=tk.NORMAL)
            self.text_area.delete(1.0, tk.END)

            # **Log details to text area**
            self.text_area.insert(tk.END, f"Original size: {original_size} points\n")
            self.text_area.insert(tk.END, f"Size after removing duplicates: {cleaned_size} points\n\n")

            # **Log removed duplicates**
            if not self.removed_duplicates.empty:
                self.text_area.insert(tk.END, "Removed duplicates:\n")
                for _, row in self.removed_duplicates.iterrows():
                    self.text_area.insert(tk.END, f"  Original[{row['Original_Index']}] → ({row['X']:.5f}, {row['Y']:.5f}, {row['Z']:.5f})\n")
                self.text_area.insert(tk.END, "-" * 50 + "\n")

            self.text_area.config(state=tk.DISABLED)
            self.sort_button.config(state=tk.NORMAL)
            self.plot_button.config(state=tk.DISABLED)
            self.save_button.config(state=tk.DISABLED)

        except Exception as e:
            messagebox.showerror("Error", f"Failed to load file: {str(e)}")

    def sort_points(self):
        if self.cleaned_data is None:
            messagebox.showerror("Error", "No data loaded!")
            return

        starting_point_index = self.cleaned_data['X'].idxmin()  # Find leftmost point

        def sort_points_nn(df, start_idx):
            points = df[['X', 'Y', 'Z']].values
            tree = KDTree(points[:, :2])  # Use only X, Y for nearest neighbor search

            sorted_points = []
            visited = set()
            current_point = points[start_idx]
            sorted_points.append((start_idx, current_point))
            visited.add(start_idx)

            while len(visited) < len(points):
                distances, indices = tree.query(current_point[:2], k=len(points))
                for idx in indices:
                    if idx not in visited:
                        sorted_points.append((idx, points[idx]))
                        current_point = points[idx]
                        visited.add(idx)
                        break

            sorted_df = pd.DataFrame([p[1] for p in sorted_points], columns=['X', 'Y', 'Z'])

            if self.close_var.get() == "Yes":
                sorted_df = pd.concat([sorted_df, sorted_df.iloc[[0]]], ignore_index=True)

            return sorted_df, sorted_points

        self.sorted_data, sorted_points_info = sort_points_nn(self.cleaned_data, starting_point_index)
        messagebox.showinfo("Success", "Points sorted successfully!")

        # **Update text area with sorting order**
        self.text_area.config(state=tk.NORMAL)
        self.text_area.insert(tk.END, "Mapping from cleaned to sorted:\n")
        for original_idx, (sorted_idx, sorted_point) in enumerate(sorted_points_info):
            self.text_area.insert(
                tk.END, f"  Cleaned[{sorted_idx}] ({sorted_point[0]:.5f}, {sorted_point[1]:.5f}, {sorted_point[2]:.5f}) → Sorted[{original_idx}]\n"
            )
        self.text_area.config(state=tk.DISABLED)

        self.plot_button.config(state=tk.NORMAL)
        self.save_button.config(state=tk.NORMAL)

    def plot_results(self):
        if self.original_data is None or self.cleaned_data is None or self.sorted_data is None:
            messagebox.showerror("Error", "Data not processed!")
            return

        fig, axs = plt.subplots(1, 3, figsize=(15, 5))
        fig.canvas.manager.set_window_title("Results")
        plot_type = self.plot_type_var.get()

        def plot_data(ax, x, y, title, color):
            if plot_type == "scatter":
                ax.scatter(x, y, color=color)
            else:
                ax.plot(x, y, marker='o', linestyle='-', color=color)
            ax.set_title(title)
            ax.set_xlabel("X")
            ax.set_ylabel("Y")
        
        plot_data(axs[0], self.original_data['X'], self.original_data['Y'], "Original", 'r')
        plot_data(axs[1], self.cleaned_data['X'], self.cleaned_data['Y'], "Cleaned", 'g')
        plot_data(axs[2], self.sorted_data['X'], self.sorted_data['Y'], "Sorted", 'b')

        plt.tight_layout()
        plt.show()

    def save_csv(self):
        save_path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV Files", "*.csv")])
        if not save_path:
            return

        self.original_data.to_csv(save_path.replace(".csv", "_original.csv"), index=False, float_format="%.5f")
        self.cleaned_data.to_csv(save_path.replace(".csv", "_cleaned.csv"), index=False, float_format="%.5f")
        self.sorted_data.to_csv(save_path.replace(".csv", "_sorted.csv"), index=False, float_format="%.5f")
        messagebox.showinfo("Success", "All CSV files saved successfully!")


    def animate_nns(self):
        """
        Animation Sequence (using precomputed data):
          Phase 1: Show original data as scatter.
          Phase 2: Show unsorted data (line with markers in CSV order).
          Phase 3: Overlay duplicate points (in red) with duplicate count.
          Phase 4: Show cleaned data (line with markers in green) with unique count.
          Phase 5: Animate a transformation from the cleaned (unsorted) order 
                   to the sorted order (precomputed) so that the sorting process is visible.
        """
        # Make sure required data is computed.
        if (self.original_data is None or self.cleaned_data is None or self.sorted_data is None):
            messagebox.showerror("Error", "Please load, clean, and sort data before animating.")
            return

        # Set up the figure and axis.
        fig, ax = plt.subplots(figsize=(8, 6))
        fig.canvas.manager.set_window_title("Nearest Neighbor Search (NNS) animation")
        ax.set_xlabel("X")
        ax.set_ylabel("Y")
        ax.set_aspect("equal", adjustable="box")
        all_x = self.original_data["X"]
        all_y = self.original_data["Y"]
        ax.set_xlim(all_x.min() - 1, all_x.max() + 1)
        ax.set_ylim(all_y.min() - 1, all_y.max() + 1)
        ax.set_title("")

        # Define phase durations (in frames)
        phase1_end = 50    # Phase 1: Original scatter
        phase2_end = 100   # Phase 2: Unsorted line with markers
        phase3_end = 150   # Phase 3: Duplicate overlay
        phase4_end = 200   # Phase 4: Cleaned data display
        phase5_end = 500   # Phase 5: Transformation to sorted order
        total_frames = phase5_end

        # --- Use Precomputed Data ---
        # A_unsorted: positions from the cleaned data (CSV order)
        A_unsorted = self.cleaned_data[['X', 'Y']].to_numpy()
        # A_sorted: positions from the sorted data (precomputed)
        A_sorted = self.sorted_data[['X', 'Y']].to_numpy()
        # Handle "Close Loop" if needed.
        if self.close_var.get() == "Yes":
            if not np.allclose(A_unsorted[0], A_unsorted[-1]):
                A_unsorted = np.vstack([A_unsorted, A_unsorted[0]])
            if not np.allclose(A_sorted[0], A_sorted[-1]):
                A_sorted = np.vstack([A_sorted, A_sorted[0]])
        else:
            n = min(A_unsorted.shape[0], A_sorted.shape[0])
            A_unsorted = A_unsorted[:n]
            A_sorted = A_sorted[:n]

        phase5_duration = phase5_end - phase4_end  # Total frames for Phase 5

        # Define a nonlinear scaling function to exaggerate the difference.
        # f(t) = (1 - exp(-k*t)) / (1 - exp(-k)), with k=3 for example.
        def scaling(t, k=3):
            return (1 - math.exp(-k * t)) / (1 - math.exp(-k))

        def update(frame):
            ax.clear()
            ax.set_xlabel("X")
            ax.set_ylabel("Y")
            ax.set_aspect("equal", adjustable="box")
            ax.set_xlim(all_x.min() - 1, all_x.max() + 1)
            ax.set_ylim(all_y.min() - 1, all_y.max() + 1)
            ax.set_title("")

            if frame < phase1_end:
                # Phase 1: Original Data (Scatter)
                ax.scatter(self.original_data["X"], self.original_data["Y"], color="blue")
                ax.text(all_x.min(), all_y.max()+2.5, "Phase 1: Original Data", fontsize=12, color="blue")
            elif frame < phase2_end:
                # Phase 2: Unsorted Data (Connected in CSV order)
                ax.plot(self.original_data["X"], self.original_data["Y"],
                        marker="o", linestyle="-", color="gray")
                ax.text(all_x.min(), all_y.max()+2.5, "Phase 2: Unsorted Original Data", fontsize=12, color="gray")
            elif frame < phase3_end:
                # Phase 3: Duplicate Overlay
                ax.plot(self.original_data["X"], self.original_data["Y"],
                        marker="o", linestyle="-", color="gray")
                if not self.removed_duplicates.empty:
                    ax.scatter(self.removed_duplicates["X"], self.removed_duplicates["Y"],
                               color="red", s=100)
                    dup_count = len(self.removed_duplicates)
                    ax.text(all_x.min(), all_y.max()+2.5, f"Phase 3: Duplicates: {dup_count}", fontsize=12, color="red")
            elif frame < phase4_end:
                # Phase 4: Cleaned Data Display
                ax.plot(self.cleaned_data["X"], self.cleaned_data["Y"],
                        marker="o", linestyle="-", color="green")
                unique_count = len(self.cleaned_data)
                ax.text(all_x.min(), all_y.max()+2.5, f"Phase 4: Cleaned Data (Unique Points: {unique_count})", fontsize=12, color="green")
            else:
                # Phase 5: Transformation (Morph) from unsorted (A_unsorted) to sorted (A_sorted)
                if frame == total_frames - 1:
                    ax.plot(self.sorted_data["X"], self.sorted_data["Y"],
                            marker="o", linestyle="-", color="blue")
                    ax.text(all_x.min(), all_y.max()+2.5, "Sorted Data", fontsize=12, color="blue")
                else:
                    t = (frame - phase4_end) / phase5_duration  # t goes from 0 to 1
                    # Exaggerate the transformation using the scaling function:
                    f = scaling(t, k=3)
                    new_pos = A_unsorted + f * (A_sorted - A_unsorted)
                    ax.plot(new_pos[:, 0], new_pos[:, 1],
                            marker="o", linestyle="-", color="blue")
                    ax.text(all_x.min(), all_y.max()+2.5, "Phase 5: Transforming to Sorted Order", fontsize=12, color="blue")
            return []

        anim = animation.FuncAnimation(fig, update, frames=total_frames, interval=100, repeat=False)
        plt.show()


if __name__ == "__main__":
    root = tk.Tk()
    app = PointCloudSorter(root)
    root.mainloop()
