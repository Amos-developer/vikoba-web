<script setup>
import { ref, computed } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";

const search = ref("");

const members = ref([
  {
    id: 1,
    first_name: "John",
    last_name: "Mushi",
    phone: "0712345678",
    gender: "Male",
    status: "Active"
  },
  {
    id: 2,
    first_name: "Amina",
    last_name: "Said",
    phone: "0755555555",
    gender: "Female",
    status: "Active"
  }
]);

const filteredMembers = computed(() => {
  return members.value.filter(member =>
    `${member.first_name} ${member.last_name}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <DashboardLayout>

    <!-- PAGE HEADER -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
    >
      <div>
        <h2 class="fw-bold mb-1">
          Members
        </h2>

        <p class="text-muted mb-0">
          Manage all Vikoba members
        </p>
      </div>

      <button class="btn btn-success">
        <i class="bi bi-person-plus-fill me-2"></i>
        Add Member
      </button>
    </div>

    <!-- STATS -->
    <div class="row g-3 mb-4">

      <div class="col-12 col-md-4">
        <div class="card stats-card border-0 shadow-sm">
          <div class="card-body">
            <small>Total Members</small>
            <h3 class="fw-bold mb-0">
              24
            </h3>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card stats-card border-0 shadow-sm">
          <div class="card-body">
            <small>Active Members</small>
            <h3 class="fw-bold mb-0 text-success">
              20
            </h3>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card stats-card border-0 shadow-sm">
          <div class="card-body">
            <small>New This Month</small>
            <h3 class="fw-bold mb-0 text-primary">
              4
            </h3>
          </div>
        </div>
      </div>

    </div>

    <!-- SEARCH -->
    <div class="card border-0 shadow-sm mb-4">

      <div class="card-body">

        <div class="input-group">

          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>

          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search members..."
          >

        </div>

      </div>

    </div>

    <!-- TABLE -->
    <div class="card border-0 shadow-sm">

      <div class="card-header bg-white">
        <h5 class="mb-0">
          Member List
        </h5>
      </div>

      <div class="table-responsive">

        <table class="table align-middle mb-0">

          <thead class="table-light">

            <tr>
              <th>Member</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            <tr
              v-for="member in filteredMembers"
              :key="member.id"
            >

              <td>

                <div
                  class="d-flex align-items-center gap-3"
                >

                  <div class="avatar">
                    {{ member.first_name.charAt(0) }}
                  </div>

                  <div>

                    <div class="fw-semibold">
                      {{ member.first_name }}
                      {{ member.last_name }}
                    </div>

                    <small class="text-muted">
                      Member ID:
                      {{ member.id }}
                    </small>

                  </div>

                </div>

              </td>

              <td>
                {{ member.phone }}
              </td>

              <td>
                {{ member.gender }}
              </td>

              <td>

                <span
                  class="badge bg-success"
                >
                  {{ member.status }}
                </span>

              </td>

              <td>

                <button
                  class="btn btn-sm btn-outline-primary me-2"
                >
                  View
                </button>

                <button
                  class="btn btn-sm btn-outline-warning"
                >
                  Edit
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </DashboardLayout>
</template>

<style scoped>
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #0d6efd;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-card {
  transition: 0.3s;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.table tbody tr:hover {
  background: #f8fafc;
}
</style>`