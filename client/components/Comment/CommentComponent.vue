<!-- Reusable component representing a single comment and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="comment"
  >
    <header>
      <h3 class="commentor">
        @{{ comment.commentor }}
      </h3>
      <div
        v-if="$store.state.username === comment.commentor"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteComment">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ comment.content }}
    </p>
    <p class="info">
      Posted at {{ comment.dateModified }}
      <i v-if="comment.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'CommentComponent',
  props: {
    // Data from the stored comment
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this comment is in edit mode
      draft: this.comment.content, // Potentially-new content for this comment
      alerts: {} // Displays success/error messages encountered during comment modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this comment.
       */
      this.editing = true; // Keeps track of if a comment is being edited
      this.draft = this.comment.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this comment.
       */
      this.editing = false;
      this.draft = this.comment.content;
    },
    deleteComment() {
      /**
       * Deletes this comment.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted comment!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates comment to have the submitted draft content.
       */
      if (this.comment.content === this.draft) {
        const error = 'Error: Edited comment content should be different than current comment content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited comment!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the comment's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/comment/${this.comment._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshCommments');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.comment {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
